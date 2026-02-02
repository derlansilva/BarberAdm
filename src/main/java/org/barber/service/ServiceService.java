package org.barber.service;

import org.barber.model.Service;
import org.barber.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;


@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;


    public boolean saveNewService(Service s){
        List<Service> service = serviceRepository.getAllServices();

        for(Service s1 : service){
            if(s1.getName() == s.getName()){
                return false;
            }
        }

        serviceRepository.saveNewService(s);
        return true;
    }

    public List<Service> getAllServices(){
        return serviceRepository.getAllServices();
    }
}
