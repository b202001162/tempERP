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
public class SuperAdmin {
    @Id
    private String email;
    private String name;
    private String mobileNumber;
    private String dateOfBirth;
    private String gander;
    private String password;
    private int numberOfInstituteAdmins = 1;
    private int numberOfFaculties = 1;
    private int numberOfTAs = 1;
}
