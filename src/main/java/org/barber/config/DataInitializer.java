package org.barber.config;


import org.barber.model.User;
import org.barber.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Se o banco estiver vazio, ele cria o admin
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("derlanbentes");
                admin.setPassword(passwordEncoder.encode("03394579"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("USER CREATED: derlanbentes / 03394579");
            }
        };
    }
}
