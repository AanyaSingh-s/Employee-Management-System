package controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("application", "Employee Management System");
        info.put("status", "running");
        info.put("endpoints", Map.of(
                "employees", "/api/employees",
                "managers", "/api/managers",
                "admins", "/api/admins",
                "leaves", "/api/leaves",
                "duties", "/api/duties"
        ));
        return info;
    }
}
