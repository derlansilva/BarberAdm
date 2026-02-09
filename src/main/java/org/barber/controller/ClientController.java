package org.barber.controller;

import org.barber.model.Client;
import org.barber.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class ClientController {
    @Autowired private ClienteRepository clienteRepository;

    @PostMapping("/register/client")
    public ResponseEntity<String> handleRegisterClient(@RequestParam String name  , @RequestParam String whatsapp){

        try {

            if(clienteRepository.findByName(name).isPresent()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cliente ja existe");
            }

            Client client = new Client(name , whatsapp);

            clienteRepository.save(client);

            return ResponseEntity.ok("Client registered successfully!");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }

    @GetMapping("/api/find")
    public List<Client> findAllClient(@RequestParam("termo") String name){
        return clienteRepository.findByNameContainingIgnoreCase(name);
    }
}
