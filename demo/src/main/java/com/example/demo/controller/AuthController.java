package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.serivce.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            logger.info("Attempting authentication for user: {}", loginRequest.get("username"));
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("username"),
                            loginRequest.get("password")
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            User user = userService.findByUsername(userDetails.getUsername());

            if (user == null) {
                logger.error("User not found in database: {}", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found in database");
            }

            String jwt = jwtUtil.generateToken(userDetails, user.getId());

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            logger.warn("Bad credentials for user: {}", loginRequest.get("username"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            logger.error("Authentication error for user: {}", loginRequest.get("username"), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        try {
            logger.info("Attempting signup for user: {}", signUpRequest.get("username"));
            if (userService.existsByUsername(signUpRequest.get("username"))) {
                logger.warn("Username already taken: {}", signUpRequest.get("username"));
                return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
            }

            User user = new User();
            user.setUsername(signUpRequest.get("username"));
            user.setPassword(passwordEncoder.encode(signUpRequest.get("password")));

            String role = signUpRequest.get("role");
            if ("ADMIN".equalsIgnoreCase(role)) {
                user.setRoles("ADMIN");  // Set role as "ADMIN"
            } else {
                user.setRoles("USER");   // Set role as "USER"
            }


            userService.save(user);
            logger.info("User registered successfully: {}", signUpRequest.get("username"));
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Signup error for user: {}", signUpRequest.get("username"), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred during signup");
        }
    }
}