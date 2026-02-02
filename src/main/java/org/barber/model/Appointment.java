package org.barber.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name ="appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private ServiceModel serviceModel;

    private LocalDateTime date;


    public Appointment(Cliente cliente, LocalDateTime date) {
        this.cliente = cliente;
        this.date = date;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
