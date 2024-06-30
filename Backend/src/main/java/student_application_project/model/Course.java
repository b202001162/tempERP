package student_application_project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Document(collection = "Courses")
public class Course {
    @Id
    private String id;
    @Indexed(unique = true)
    private String name;
    private String description = "Description not available";
    private String instructor;
    private String facultyEmail;
    private double credits;
    private double courseRating;
    private int numOfStudents = 0;
    private List <String> domains;
    private List<TADetails> tas;
    private List<Topic> topics;
    private List<StudentCustom> students;
    private boolean isAvailable = true;
    private boolean isEnded = false;
    private boolean isArchived = false;
    private boolean isGraded = false;
    private List<Result> results;
    private short semester = 0;
    private String instituteName;
    private Boolean isApprovedByAdmin = false;
    private Boolean isCoreCourse = false;
    private String prerequisites = "";
    private  String prerequisiteCourseName= "";
    private int maxStudentNum = 100;
}
