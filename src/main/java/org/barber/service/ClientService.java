package org.barber.service;

import org.barber.model.Cliente;
import org.barber.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;


@Service
public class ClientService {
    @Autowired
    private ClienteRepository clienteRepository;

    public ClientService(ClienteRepository clienteRepository) {}

    public boolean saveNewCliente(String name , String whatsapp ){
        Cliente clienteExist = clienteRepository.findClienteById(name);
        if(clienteExist != null){
            return false;
        }

        Cliente newClient = new Cliente(name, whatsapp);

        clienteRepository.saveCliente(newClient);

        return   true;
    }

    public List<Cliente> findAllClientesByName(String name){
        if(name == null ){
            return Collections.emptyList();
        }

        return clienteRepository.findAllClientesByName(name);
    }
}
