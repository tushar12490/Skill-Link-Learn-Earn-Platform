import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { createCourse, enrollCourse, fetchCourses } from '../services/courseService.js';
import CourseCard from '../components/CourseCard.jsx';
import AppShell from '../components/AppShell.jsx';
import PageContainer from '../components/PageContainer.jsx';
import LoadingState from '../components/LoadingState.jsx';

const initialCourseForm = {
  title: '',
  description: '',
  videoUrl: '',
  price: ''
};

const CoursesPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const userRole = user?.role?.toUpperCase();
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialCourseForm);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchParams, setSearchParams] = useSearchParams();
  const createRequested = searchParams.get('create');

  const canCreateCourse = useMemo(() => userRole === 'FREELANCER', [userRole]);
  const canEnroll = useMemo(() => userRole === 'LEARNER', [userRole]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load courses right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (createRequested && canCreateCourse) {
      setOpen(true);
      setSearchParams((prev) => {
        prev.delete('create');
        return prev;
      });
    }
  }, [createRequested, canCreateCourse, setSearchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await createCourse({ ...form, price: Number(form.price) });
      await loadCourses();
      setForm(initialCourseForm);
      setOpen(false);
      setSnackbar({ open: true, message: 'Course published successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to create course.', severity: 'error' });
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);
      setSnackbar({ open: true, message: 'Enrollment confirmed. See you in class!', severity: 'success' });
      await loadCourses();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Unable to enroll right now.', severity: 'error' });
    }
  };

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const filteredCourses = useMemo(() => {
    const bySearch = courses.filter((course) => {
      if (!search) return true;
      return (
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.mentorName?.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (sort === 'price_asc') {
      return [...bySearch].sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === 'price_desc') {
      return [...bySearch].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return bySearch;
  }, [courses, search, sort]);

  return (
    <AppShell>
      <PageContainer>
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Skill accelerators
              </Typography>
              <Typography color="text.secondary">
                Learn from vetted mentors and ship job-ready portfolios.
              </Typography>
            </Box>
          {canCreateCourse && (
            <Button variant="contained" size="large" onClick={() => setOpen(true)}>
              Launch a course
            </Button>
          )}
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by topic or mentor"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              )
            }}
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort by"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <MenuItem value="popular">Most popular</MenuItem>
              <MenuItem value="price_asc">Price: Low to high</MenuItem>
              <MenuItem value="price_desc">Price: High to low</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {loading ? (
          <LoadingState label="Loading courses curated for you..." />
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Alert severity="error" sx={{ display: 'inline-flex' }}>
              {error}
            </Alert>
          </Box>
        ) : filteredCourses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6">No courses found</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Adjust your search or explore new segments curated weekly.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid key={course.id} item xs={12} md={6}>
                <CourseCard course={course} canEnroll={canEnroll} onEnroll={handleEnroll} />
              </Grid>
            ))}
          </Grid>
        )}
        </Stack>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create a course</DialogTitle>
        <Box component="form" onSubmit={handleCreate}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="Video URL"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                required
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Publish
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PageContainer>
    </AppShell>
  );
};

export default CoursesPage;
