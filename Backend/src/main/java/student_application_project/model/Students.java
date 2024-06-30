package student_application_project.model;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

// import jakarta.validation.OverridesAttribute.List;
import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.Column;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// import org.hibernate.validator.constraints.Unique;
import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Students")
public class Students {
//    @Id
//    private String id;
    @NotNull(message = "Name cannot be null")
    private String firstName;
    private String lastName;
    private String password;
    private String mobileNumber;
    @Id
    @Indexed(unique = true)
    private String email;
    @NotNull(message = "LoggedIn cannot be null")
    private boolean loggedIn;
    private short semester = 1;
    private String dateOfBirth;
    private String instituteAdminEmail;
    private String gander;
    private String Program;
    private String instituteName;
    private List<Course> courses;
    private boolean isCourseRegistrationOpen = false;
    private LocalDate lastDateOfCourseRegistration;
    private List<String> tempRegisteredCourses = new ArrayList<>();
    private List<?>[] semesterWiseCourses;

    {
        semesterWiseCourses = new List<?>[8];
    }

    private List<List<Result>> semesterWiseResults = new ArrayList<>();
}
