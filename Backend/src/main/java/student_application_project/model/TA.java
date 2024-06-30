package student_application_project.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "TA")
public class TA {
    // getter and setter method
    @Id
    private String email;
    private String name;
    private float rating = 0;
    private String password;
    private String instituteName;
    private List<String> domains;
    private List<Course> currentCourses;
    private List<Course> oldCourses;
    private Boolean isAvailable = true;
    private List<String> requestNotifications = new ArrayList<>();
    private int numberOfTokens = 0;
    private int numberOfTokensResolved = 0;
}
