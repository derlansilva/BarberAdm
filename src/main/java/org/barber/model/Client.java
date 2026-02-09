package org.barber.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @JsonProperty("name")
    private String name ;
    private String whatsapp;

    public Client() {}

    public Client(String name, String whatsapp) {
        this.id = id;
        this.name = name;
        this.whatsapp = whatsapp;
    }
}
