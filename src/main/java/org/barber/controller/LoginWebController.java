package org.barber.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;


@Controller
public class LoginWebController {

    @GetMapping("/login")
    public String loginPage(Model model) {
        // Isso ativa o overlay de login sobre a dashboard
        model.addAttribute("showLogin", true);
        return "index";
    }

}
