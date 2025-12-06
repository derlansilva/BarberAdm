package com.example.evoluxo.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class controller {

    @GetMapping("admin")
    public String admin(){
        return "index";
    }
}
