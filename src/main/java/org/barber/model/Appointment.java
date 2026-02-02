package org.barber.model;

import java.time.LocalDateTime;

public class Appointment {
    private Cliente cliente;
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
