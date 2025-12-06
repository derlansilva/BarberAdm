package com.example.evoluxo.model;

public class Cliente {
    private String nome;
    private String whatsapp;

    public Cliente(String nome , String whatsapp) {
        this.nome = nome;
        this.whatsapp = whatsapp;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }
}
