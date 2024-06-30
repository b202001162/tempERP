package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InstituteAdmin {
    @Id
    private String email;
    private String name;
    private String mobileNumber;
    private String dateOfBirth;
    private String gander;
    private String instituteName;
    private String password;
    private int numberOfFaculties = 0;
    private int numberOfTAs = 0;
    private int numberOfStudents = 0;
    private List<FacultyInfoForAdmin> faculties = new ArrayList<>();
    private List<TAInformationForAdmin> tas = new ArrayList<>();
    private List<StudentDetails> students = new ArrayList<>();
    private List<StudentCustom> studentWhoTempRegistered = new ArrayList<>();
    private int [] semesterWiseRegisterCount = new int[]{0,0,0,0,0,0,0,0};
    private int [] semesterWiseStudentCount = new int[]{0,0,0,0,0,0,0,0};
    private boolean isCourseRegistrationOpen = false;
    private boolean isCourseRegistrationEnded = false;
}
