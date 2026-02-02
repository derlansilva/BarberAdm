package org.barber.repository;

import org.barber.model.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ClienteRepository {
    private JdbcTemplate jdbcTemplate;
    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    public int saveCliente(Cliente cliente){
        String sql = "INSERT INTO CLIENTE (nome , whatsapp) VALUES (?, ?)";
        return jdbcTemplate.update(sql, cliente.getNome(), cliente.getWhatsapp());

    }

    public Cliente findClienteById(String name){
        String sql = "SELECT * FROM CLIENTE WHERE nome =?";

        try{
            return jdbcTemplate.queryForObject(sql , (rs, rowNum) ->
                            new Cliente(
                                    rs.getString("nome"),
                                    rs.getString("whatsapp")
                            ),
                    name
            );
        }catch (org.springframework.dao.EmptyResultDataAccessException e){
            return  null;
        }

    }

    public List<Cliente> findAllClientesByName(String name){

        String nameWithWildcard = "%"+name+"%";
        String sql = "SELECT * FROM CLIENTE WHERE nome LIKE ?   LIMIT 10";

        return jdbcTemplate.query(sql , (rs, rowNum) ->
                new Cliente(
                        rs.getString("nome"),
                        rs.getString("whatsapp")
                ),nameWithWildcard
        );
    }

}
