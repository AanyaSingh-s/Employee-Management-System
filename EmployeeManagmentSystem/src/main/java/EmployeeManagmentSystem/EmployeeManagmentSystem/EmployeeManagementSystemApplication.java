package EmployeeManagmentSystem.EmployeeManagmentSystem;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
		"EmployeeManagmentSystem.EmployeeManagmentSystem",
		"model",
		"repository",
		"controller",
		"service",
		"config",
		"security"
})
@EntityScan(basePackages = "model")
@EnableJpaRepositories(basePackages = "repository")
public class EmployeeManagementSystemApplication {



	public static void main(String[] args) {

		SpringApplication.run(
				EmployeeManagementSystemApplication.class,
				args
		);
		System.out.println("Employee mgt system");
	}
}