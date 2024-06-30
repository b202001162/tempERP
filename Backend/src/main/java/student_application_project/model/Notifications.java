package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.sql.Date;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notifications {
    @Id
    private String id;
    private String title;
    private String message;
    private int type;
    private String courseId;
    private String courseName;
    private Boolean status = false;
//    private String senderId;
    private String senderName;
    private String senderEmail;
    private String senderRole;
//    private String receiverId;
    private Boolean requestAcceptance = false;
    private Boolean requestRejection = false;
    private String RejectionReason;
    private String receiverName;
    private String receiverEmail;
    private String receiverRole;
    private String email;
//    private String date;
    private LocalDateTime date = LocalDateTime.now();
    private LocalDateTime dueDate;

}
