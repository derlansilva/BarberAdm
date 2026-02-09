package org.barber.model;

import jakarta.persistence.*;
import org.barber.utils.AppointmentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client; // Relacionamento Many-to-One com Client

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceModel service; // Relacionamento Many-to-One com ServiceModel

    private LocalDateTime appointmentTime; // Data e hora do agendamento

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDENTE; // Status padrão


    public Appointment() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public ServiceModel getService() { return service; }
    public void setService(ServiceModel service) { this.service = service; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}