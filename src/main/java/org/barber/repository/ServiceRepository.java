package org.barber.repository;

import org.barber.model.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class ServiceRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public int saveNewService(Service service){
        String sql = "INSERT INTO SERVICO (nome, preco, duracao_minutos) VALUES (? , ? ,?)";
        return jdbcTemplate.update(sql , service.getName(), service.getTime(), service.getPrice());

    }

    public List<Service> getAllServices(){
        String sql = "SELECT * FROM SERVICO";

        return jdbcTemplate.query(sql ,  (rs, rowNum) ->
                new Service(
                        rs.getString("nome"),
                        rs.getDouble("preco"),
                        rs.getString("duracao_minutos")
                ));
    }
}
