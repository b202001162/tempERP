package student_application_project.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "faculty")
public class Faculties {
//    @Id
//    private int id;

    private String name;
    @Id
    private String email;
    private String Password = "password";
    private String instituteName;
    private int totalNumberOfCourses = 0;
    private int currentSemesterCourses = 0;
    private List<Course> currentCourseList = new ArrayList<>();
    private List<?> [] semseterWiseCourseList;
    private List<Course> oldCourseList = new ArrayList<>();
}
