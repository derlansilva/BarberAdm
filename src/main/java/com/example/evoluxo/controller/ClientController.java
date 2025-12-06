package com.example.evoluxo.controller;


import com.example.evoluxo.model.Cliente;
import com.example.evoluxo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PostMapping("/cadastrar")
    public ResponseEntity<String> handleCadastroCliente(@RequestParam String nome , @RequestParam  String whatsapp  ){
        System.out.printf("nome " + nome );

        boolean sucess = clientService.saveNewCliente(nome,whatsapp);



        if(sucess){

            System.out.printf("Cliente cadastrado com sucesso!\n");
            return ResponseEntity.ok("Cliente cadastrado com sucesso!");

        }
        else{
            System.out.printf("Cliente cadastrado com erro!\n");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao cadastrar ou cliente já existe.");
        }
    }

    @GetMapping("/api/find")
    public List<Cliente> findAllClientes(@RequestParam("termo") String name){

        System.out.println("verificando se esta batendo no back");
        List<Cliente> cliente = clientService.findAllClientesByName(name);

        for(Cliente c : cliente){
            System.out.println(c.getNome());
        }
        return clientService.findAllClientesByName(name);
    }
}
