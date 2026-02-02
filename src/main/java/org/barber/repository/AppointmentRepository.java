package org.barber.repository;

import org.barber.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository  extends JpaRepository<Appointment, Long> {
}
