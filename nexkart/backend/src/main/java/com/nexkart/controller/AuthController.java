package com.nexkart.controller;

import com.nexkart.dto.AuthDto;
import com.nexkart.model.User;
import com.nexkart.repository.UserRepository;
import com.nexkart.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest request) {
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtToken(authentication);

			User user = userRepository.findByEmail(request.getEmail())
					.orElseThrow(() -> new RuntimeException("User not found"));

			AuthDto.AuthResponse response = new AuthDto.AuthResponse(jwt, user.getId(), user.getFirstName(),
					user.getLastName(), user.getEmail(), user.getRole().name());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Invalid email or password");
			return ResponseEntity.status(401).body(error);
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest request) {
		Map<String, String> response = new HashMap<>();

		if (userRepository.existsByEmail(request.getEmail())) {
			response.put("message", "Email already in use!");
			return ResponseEntity.badRequest().body(response);
		}

		User user = new User();
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setPhone(request.getPhone());
		user.setRole(User.Role.CUSTOMER);
		user.setEnabled(true);

		userRepository.save(user);

		response.put("message", "User registered successfully!");
		return ResponseEntity.ok(response);
	}

	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(Authentication authentication) {
		try {
			String email = authentication.getName();
			User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

			Map<String, Object> result = new HashMap<>();
			result.put("id", user.getId());
			result.put("firstName", user.getFirstName());
			result.put("lastName", user.getLastName());
			result.put("email", user.getEmail());
			result.put("phone", user.getPhone() != null ? user.getPhone() : "");
			result.put("role", user.getRole().name());

			return ResponseEntity.ok(result);
		} catch (Exception e) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Unauthorized");
			return ResponseEntity.status(401).body(error);
		}
	}
}