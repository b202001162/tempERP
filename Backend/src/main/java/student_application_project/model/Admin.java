package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Admin {
    @Id
    private String email;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String dateOfBirth;
    private String gander;
    private String password;
}
