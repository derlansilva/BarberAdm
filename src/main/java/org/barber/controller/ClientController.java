package org.barber.controller;

import org.barber.model.Client;
import org.barber.model.Cliente;
import org.barber.repository.ClienteRepository;
import org.barber.service.ClientService;
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
        if(clienteRepository.findByName(name).isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cliente ja existe");
        }

        clienteRepository.save(new Client(name , whatsapp));

        return ResponseEntity.ok("Cliente cadastrado com sucesso");
    }

    @GetMapping
    public List<Client> findAllClient(@RequestParam("termo") String name){
        return clienteRepository.findByNomeContainingIgnoreCase(name);
    }
}
