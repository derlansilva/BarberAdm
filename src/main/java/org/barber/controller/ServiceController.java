package org.barber.controller;

import org.barber.model.Service;
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

    @Autowired
    ServiceService serviceService;

    @PostMapping("/service")
    public ResponseEntity<String> save(@RequestParam String name , @RequestParam String price , @RequestParam String time) {

        Double priceDouble = Double.parseDouble(price);
        System.out.println("testando se esta batendo no service save");
        System.out.printf("Recebido: %s\n", name);
        Service service = new Service(name, priceDouble, time);


        boolean result = serviceService.saveNewService(service);

        if (result) {
            System.out.printf("sucesso: %s\n", service);
            // Retorna o objeto Service salvo com status 200 OK
            return ResponseEntity.ok("salvo com sucesso");
        } else {
            // Retorna status 500 Internal Server Error ou 400 Bad Request
            System.out.printf("erro: Falha ao salvar %s\n", service);
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/api/services")
    public ResponseEntity<List<Service>> findAll() {
        List<Service> services = serviceService.getAllServices();

        return ResponseEntity.ok(services);
    }
}
