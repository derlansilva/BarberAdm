package org.barber.repository;

import org.barber.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository  extends JpaRepository<Appointment, Long> {

    // Query de soma real forçando os tipos corretos para o PostgreSQL
    @Query(value = "SELECT SUM(s.price) FROM appointments a " +
            "JOIN services s ON s.id = a.service_id " +
            "WHERE a.status = 'CONCLUIDO' " +
            "AND a.appointment_time >= CAST(:inicio AS TIMESTAMP) " +
            "AND a.appointment_time <= CAST(:fim AS TIMESTAMP)",
            nativeQuery = true)
    BigDecimal somarGanhosReais(@Param("inicio") LocalDateTime inicio,
                                     @Param("fim") LocalDateTime fim);


    @Query(value = "SELECT a.* FROM appointments a " +
            "JOIN clients c ON c.id = a.client_id " +
            "WHERE (:startDate IS NULL OR a.appointment_time >= CAST(:startDate AS TIMESTAMP)) " +
            "AND (:endDate IS NULL OR a.appointment_time <= CAST(:endDate AS TIMESTAMP)) " +
            "AND (:status IS NULL OR a.status = CAST(:status AS TEXT)) " +
            "AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:name AS TEXT), '%')))",
            nativeQuery = true)
    List<Appointment> findByFilter(
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            @Param("status") String status,
            @Param("name") String name
    );

    List<Appointment> findByClientId(Long clientId);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);



}
