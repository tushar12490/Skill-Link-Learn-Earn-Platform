import {
	Box,
	Button,
	Chip,
	Container,
	Grid,
	Paper,
	Stack,
	Typography
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Link as RouterLink } from 'react-router-dom';

const featureCards = [
	{
		title: 'Work + Learning flywheel',
		description: 'Ship real projects, then turn experience into on-demand courses to scale your impact.',
		badge: 'Clients & mentors'
	},
	{
		title: 'Smart talent matching',
		description: 'AI-assisted briefs and proposals connect the right freelancers and clients in hours, not weeks.',
		badge: 'Freelancers'
	},
	{
		title: 'Career accelerators',
		description: 'Immersive learning paths with mentorship, certifications, and community to advance faster.',
		badge: 'Learners'
	}
];

const testimonials = [
	{
		quote: '“SkillLink helped our product squad deliver in record time while mentoring future teammates.”',
		author: 'Nia Patel',
		role: 'Head of Product @ Aurora Labs'
	},
	{
		quote: '“I now teach and ship in the same place. Projects become curriculum that keeps selling.”',
		author: 'Jordan Blake',
		role: 'Full-stack mentor & freelancer'
	}
];

const LandingPage = () => (
	<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
		<Box
			sx={{
				position: 'relative',
				overflow: 'hidden',
				py: { xs: 10, md: 14 },
				background: 'radial-gradient(circle at top left, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at top right, rgba(129,140,248,0.2), transparent 50%)'
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={6} alignItems="center">
					<Grid item xs={12} md={7}>
						<Stack spacing={3}>
							<Chip label="New" color="secondary" sx={{ width: 'fit-content' }} />
							<Typography variant="h2" fontWeight={700} lineHeight={1.1}>
								Freelancing and learning in one powerful loop.
							</Typography>
							<Typography variant="h6" color="text.secondary" maxWidth="md">
								SkillLink unites clients, freelancers, and learners. Deliver projects, teach what you master, and unlock new revenue streams without leaving the platform.
							</Typography>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
								<Button component={RouterLink} to="/auth" size="large" variant="contained" endIcon={<ArrowForwardIcon />}>
									Join SkillLink
								</Button>
								<Button component={RouterLink} to="/courses" size="large" variant="outlined" startIcon={<PlayCircleOutlineIcon />}>
									Explore courses
								</Button>
							</Stack>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ pt: 2 }}>
								<Stack>
									<Typography variant="h4" fontWeight={700}>
										12K+
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Active members building careers
									</Typography>
								</Stack>
								<Stack>
									<Typography variant="h4" fontWeight={700}>
										4.9★
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Average mentor satisfaction
									</Typography>
								</Stack>
								<Stack>
									<Typography variant="h4" fontWeight={700}>
										₹150Cr
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Earned through SkillLink projects
									</Typography>
								</Stack>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={5}>
						<Paper
							elevation={0}
							sx={{
								p: 4,
								borderRadius: 4,
								background: 'linear-gradient(135deg, rgba(30,64,175,0.18) 0%, rgba(59,130,246,0.06) 100%)',
								border: '1px solid rgba(148,163,184,0.2)'
							}}
						>
							<Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
								Multi-role journeys
							</Typography>
							<Stack spacing={2.5} sx={{ mt: 3 }}>
								<Stack spacing={1}>
									<Typography variant="h5" fontWeight={600}>
										Clients
									</Typography>
									<Typography color="text.secondary">
										Post briefs, review portfolios, and assign talent with live milestone tracking.
									</Typography>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="h5" fontWeight={600}>
										Freelancers & mentors
									</Typography>
									<Typography color="text.secondary">
										Pitch projects, host office hours, and package deep dives into premium courses.
									</Typography>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="h5" fontWeight={600}>
										Learners
									</Typography>
									<Typography color="text.secondary">
										Enroll in mentor-led cohorts, earn certificates, and join paid apprenticeships.
									</Typography>
								</Stack>
							</Stack>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>

		<Container maxWidth="lg" sx={{ py: { xs: 10, md: 12 } }}>
			<Grid container spacing={3}>
				{featureCards.map((feature) => (
					<Grid key={feature.title} item xs={12} md={4}>
						<Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(148,163,184,0.2)', height: '100%' }}>
							<Chip label={feature.badge} color="secondary" variant="outlined" sx={{ mb: 2 }} />
							<Typography variant="h5" fontWeight={600} gutterBottom>
								{feature.title}
							</Typography>
							<Typography color="text.secondary">{feature.description}</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Container>

		<Box sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.95) 100%)', color: 'white' }}>
			<Container maxWidth="md">
				<Stack spacing={4}>
					<Typography variant="h4" textAlign="center" fontWeight={700}>
						Stories from the SkillLink network
					</Typography>
					<Grid container spacing={3}>
						{testimonials.map((testimonial) => (
							<Grid key={testimonial.author} item xs={12} md={6}>
								<Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.2)' }}>
									<Typography variant="body1" sx={{ fontStyle: 'italic' }}>
										{testimonial.quote}
									</Typography>
									<Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
										{testimonial.author}
									</Typography>
									<Typography variant="caption" color="rgba(226,232,240,0.7)">
										{testimonial.role}
									</Typography>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Container>
		</Box>

		<Container maxWidth="lg" sx={{ py: { xs: 10, md: 12 } }}>
			<Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center', border: '1px solid rgba(148,163,184,0.2)' }}>
				<Typography variant="h4" fontWeight={700} gutterBottom>
					Ready to link skills with opportunity?
				</Typography>
				<Typography color="text.secondary" maxWidth="sm" sx={{ mx: 'auto', mb: 3 }}>
					Build your profile, unlock curated projects, and join a learning community that grows with you.
				</Typography>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
					<Button component={RouterLink} to="/auth" size="large" variant="contained" endIcon={<ArrowForwardIcon />}>
						Create account
					</Button>
					<Button component={RouterLink} to="/jobs" size="large" variant="outlined">
						Browse open roles
					</Button>
				</Stack>
			</Paper>
		</Container>
	</Box>
);

export default LandingPage;
