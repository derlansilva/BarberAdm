package org.barber.repository;

import org.barber.model.Service;
import org.barber.model.ServiceModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Locale;


@Repository
public interface ServiceRepository extends JpaRepository<ServiceModel , Long> {
   boolean existsByName(String name);
}
