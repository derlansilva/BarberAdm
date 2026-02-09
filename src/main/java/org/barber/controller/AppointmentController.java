package org.barber.controller;


import org.barber.model.Appointment;
import org.barber.repository.AppointmentRepository;
import org.barber.repository.ClienteRepository;
import org.barber.repository.ServiceRepository;
import org.barber.utils.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {


    @Autowired
    private AppointmentRepository appointmentRepo;
    @Autowired private ClienteRepository clienteRepo;
    @Autowired private ServiceRepository serviceRepo;

    @PostMapping("/create")
    public ResponseEntity<String> createAppointment(
            @RequestParam("nome") String clientName,
            @RequestParam("servico") Long serviceId,
            @RequestParam("data") String date,
            @RequestParam("hora") String time) {
        try {
            // Busca o cliente pelo nome (ou ID se você salvou o ID no autocomplete)
            var client = clienteRepo.findByName(clientName)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            // Busca o serviço pelo ID selecionado no select dinâmico
            var service = serviceRepo.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

            Appointment newAppointment = new Appointment();
            newAppointment.setClient(client);
            newAppointment.setService(service);
            // Une data e hora para o formato LocalDateTime (ex: 2026-02-05T14:30)
            newAppointment.setAppointmentTime(java.time.LocalDateTime.parse(date + "T" + time));

            appointmentRepo.save(newAppointment);
            return ResponseEntity.ok("Agendamento realizado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao agendar: " + e.getMessage());
        }
    }


    @GetMapping("/today")
    public List<Appointment> getTodayAppointments() {
        // Define o início e o fim do dia de hoje
        LocalDateTime start = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        // Busca no repositório usando o método que criamos anteriormente
        return appointmentRepo.findByAppointmentTimeBetween(start, end);
    }


    @GetMapping("/filter")
    public List<Appointment> filterAppointments(
            @RequestParam(required = false) String data,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String cliente) {

        LocalDateTime startDate = null;
        LocalDateTime endDate = null;

        if (data != null && !data.isEmpty()) {
            startDate = LocalDate.parse(data).atStartOfDay();
            endDate = LocalDate.parse(data).atTime(23, 59, 59);
        }

        // Se vier vazio, mandamos NULL. Isso é vital para a query acima funcionar.
        String filterStatus = (status == null || status.isEmpty() || status.equalsIgnoreCase("Todos os Status")) ? null : status;
        String filterName = (cliente == null || cliente.isEmpty()) ? null : cliente;

        return appointmentRepo.findByFilter(startDate, endDate, filterStatus, filterName);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {

        return appointmentRepo.findById(id).map(appointment -> {
            appointment.setStatus(status);
            appointmentRepo.save(appointment);
            return ResponseEntity.ok("Status atualizado para " + status);
        }).orElse(ResponseEntity.notFound().build());
    }



    @PutMapping("/api/appointments/{id}/concluir")
    @ResponseBody
    public ResponseEntity<String> concluir(@PathVariable Long id) {
        return appointmentRepo.findById(id).map(appointment -> {
            appointment.setStatus(AppointmentStatus.CONCLUIDO);
            appointmentRepo.save(appointment);
            return ResponseEntity.ok("Status atualizado!");
        }).orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // Define o período do mês atual
        java.time.LocalDateTime inicioMes = java.time.LocalDate.now().withDayOfMonth(1).atStartOfDay();
        java.time.LocalDateTime fimMes = java.time.LocalDateTime.now().with(java.time.LocalTime.MAX);

        // Chama sua query com CAST que evita o erro 500
        BigDecimal total = appointmentRepo.somarGanhosReais(inicioMes, fimMes);

        Map<String, Object> stats = new HashMap<>();
        stats.put("ganhosMes", total != null ? total : BigDecimal.ZERO);
        return ResponseEntity.ok(stats);
    }

}
