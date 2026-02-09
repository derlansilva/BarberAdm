package org.barber.controller;

import org.barber.model.Service;
import org.barber.model.ServiceModel;
import org.barber.repository.ServiceRepository;
import org.barber.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ServiceController {

    @Autowired private ServiceRepository serviceRepository;

    @PostMapping("/register/service")
    public ResponseEntity<String> createService(@RequestParam String name , @RequestParam String price , @RequestParam String time) {


        if(serviceRepository.existsByName(name)){
            return ResponseEntity.badRequest().body("Serviçõ já cadastrada");
        }

        serviceRepository.save(new ServiceModel( name , Double.parseDouble(price) , time));

        return ResponseEntity.ok("Serviço salvo com sucesso");
    }


    @GetMapping("/findAll/services")
    public List<ServiceModel> findAll() {
        return serviceRepository.findAll();
    }
}
