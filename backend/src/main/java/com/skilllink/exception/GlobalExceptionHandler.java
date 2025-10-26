package com.skilllink.exception;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoSuchElementException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequest(RuntimeException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(SecurityException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> body = createBody(HttpStatus.BAD_REQUEST, "Validation failed");

        Map<String, String> fieldErrors = new HashMap<>();
        List<Map<String, Object>> details = new ArrayList<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            Map<String, Object> detail = new HashMap<>();
            detail.put("object", error.getObjectName());
            detail.put("message", error.getDefaultMessage());
            if (error.getCode() != null) {
                detail.put("code", error.getCode());
            }

            if (error instanceof FieldError fieldError) {
                fieldErrors.put(fieldError.getField(), error.getDefaultMessage());
                detail.put("field", fieldError.getField());
                Object sanitized = sanitizeRejectedValue(fieldError);
                if (sanitized != null) {
                    detail.put("rejectedValue", sanitized);
                }
            } else {
                fieldErrors.put(error.getObjectName(), error.getDefaultMessage());
            }

            details.add(detail);
        });

        body.put("errorCount", ex.getErrorCount());
        body.put("errors", fieldErrors);
        body.put("details", details);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = createBody(status, message);
        return ResponseEntity.status(status).body(body);
    }

    private Map<String, Object> createBody(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        if (message != null && !message.isBlank()) {
            body.put("message", message);
        }
        return body;
    }

    private Object sanitizeRejectedValue(FieldError fieldError) {
        Object value = fieldError.getRejectedValue();
        if (value == null) {
            return null;
        }

        String fieldName = fieldError.getField();
        if (fieldName != null && fieldName.toLowerCase().contains("password")) {
            return "***";
        }

        if (value instanceof CharSequence sequence) {
            String stringValue = sequence.toString();
            return stringValue.length() <= 128 ? stringValue : stringValue.substring(0, 125) + "...";
        }

        if (value instanceof Number || value instanceof Boolean) {
            return value;
        }

        if (value instanceof Map<?, ?> map) {
            return "map[size=" + map.size() + "]";
        }

        if (value.getClass().isArray()) {
            return "array[length=" + java.lang.reflect.Array.getLength(value) + "]";
        }

        if (value instanceof Iterable<?> iterable) {
            int count = 0;
            var iterator = iterable.iterator();
            while (iterator.hasNext()) {
                iterator.next();
                count++;
                if (count > 1000) {
                    break;
                }
            }
            return "collection[size=" + count + "]";
        }

        return value.getClass().getSimpleName();
    }
}
