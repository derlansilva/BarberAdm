package org.barber.repository;

import org.barber.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Client , Long> {

    Optional<Client> findByName(String name);
    List<Client> findByNomeContainingIgnoreCase(String name);

}
