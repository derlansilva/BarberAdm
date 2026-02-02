package org.barber.model;


import jakarta.persistence.*;

@Entity
@Table(name = "services")
public class ServiceModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String price;
    private String time;

    public ServiceModel() {
    }

    public ServiceModel(long id, String title, String price, String time) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.time = time;
    }
}
