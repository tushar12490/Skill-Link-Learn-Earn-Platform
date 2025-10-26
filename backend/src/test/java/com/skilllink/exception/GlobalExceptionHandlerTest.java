package com.skilllink.exception;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleValidation_masksSensitiveRejectedValues() throws Exception {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new TestPayload(), "testPayload");
        bindingResult.addError(new FieldError(
                "testPayload",
                "password",
                "superSecretPassword",
                false,
                null,
                null,
                "must be stronger"
        ));

        Map<String, Object> body = executeValidation(bindingResult);

        assertThat(body.get("errors")).isInstanceOf(Map.class);
        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) body.get("errors");
        assertThat(errors).containsEntry("password", "must be stronger");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> details = (List<Map<String, Object>>) body.get("details");
        assertThat(details).hasSize(1);
        Map<String, Object> detail = details.get(0);
        assertThat(detail.get("field")).isEqualTo("password");
        assertThat(detail.get("rejectedValue")).isEqualTo("***");
    }

    @Test
    void handleValidation_truncatesLongStringValues() throws Exception {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new TestPayload(), "testPayload");
        String longValue = "a".repeat(300);
        bindingResult.addError(new FieldError(
                "testPayload",
                "bio",
                longValue,
                false,
                null,
                null,
                "too long"
        ));

        Map<String, Object> body = executeValidation(bindingResult);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> details = (List<Map<String, Object>>) body.get("details");
        Map<String, Object> detail = details.get(0);
        Object rejectedValue = detail.get("rejectedValue");
        assertThat(rejectedValue).isInstanceOf(String.class);
        String truncated = (String) rejectedValue;
        assertThat(truncated.length()).isLessThanOrEqualTo(128);
        assertThat(truncated).endsWith("...");
    }

    @Test
    void handleValidation_summarizesMapValues() throws Exception {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new TestPayload(), "testPayload");
        bindingResult.addError(new FieldError(
                "testPayload",
                "metadata",
                Map.of("secret", "value", "internal", 123),
                false,
                null,
                null,
                "invalid"
        ));

        Map<String, Object> body = executeValidation(bindingResult);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> details = (List<Map<String, Object>>) body.get("details");
        Map<String, Object> detail = details.get(0);
        assertThat(detail.get("rejectedValue")).isEqualTo("map[size=2]");
    }

    @Test
    void handleValidation_summarizesCollectionValues() throws Exception {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new TestPayload(), "testPayload");
        bindingResult.addError(new FieldError(
                "testPayload",
                "skills",
                List.of("java", "spring", "react"),
                false,
                null,
                null,
                "invalid"
        ));

        Map<String, Object> body = executeValidation(bindingResult);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> details = (List<Map<String, Object>>) body.get("details");
        Map<String, Object> detail = details.get(0);
        assertThat(detail.get("rejectedValue")).isEqualTo("collection[size=3]");
    }

    @Test
    void handleValidation_masksArbitraryObjectContents() throws Exception {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new TestPayload(), "testPayload");
        bindingResult.addError(new FieldError(
                "testPayload",
                "profile",
                new SensitivePayload("secret"),
                false,
                null,
                null,
                "invalid"
        ));

        Map<String, Object> body = executeValidation(bindingResult);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> details = (List<Map<String, Object>>) body.get("details");
        Map<String, Object> detail = details.get(0);
        assertThat(detail.get("rejectedValue")).isEqualTo("SensitivePayload");
    }

    private Map<String, Object> executeValidation(BeanPropertyBindingResult bindingResult) throws Exception {
        MethodArgumentNotValidException ex = createException(bindingResult);
        ResponseEntity<Map<String, Object>> response = handler.handleValidation(ex);
        return Objects.requireNonNull(response.getBody());
    }

    private MethodArgumentNotValidException createException(BeanPropertyBindingResult bindingResult) throws Exception {
        Method method = DummyController.class.getDeclaredMethod("handle", TestPayload.class);
        MethodParameter parameter = new MethodParameter(method, 0);
        return new MethodArgumentNotValidException(parameter, bindingResult);
    }

    private static class DummyController {
        @SuppressWarnings("unused")
        void handle(TestPayload payload) {
            // no-op
        }
    }

    @SuppressWarnings("unused")
    private static class TestPayload {
        private String password;
        private String bio;

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }
    }

    private record SensitivePayload(String data) {
        @Override
        public String toString() {
            return "SensitivePayload{" +
                    "data='" + data + '\'' +
                    '}';
        }
    }
}
