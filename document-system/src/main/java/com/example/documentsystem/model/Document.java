package com.example.documentsystem.model;
import jakarta.persistence.*;
import java.time.Instant;

@Entity// Казва на JPA/Hibernate: този клас е таблица в базата (Entity)
@Table(name = "documents")// Името на таблицата в DB да е "documents"

public class Document {
    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//generira id avtomatichno
    private Long id;//id na dokumenta unikalno
    @Column(nullable = false)//ne moje da e null v tablicata
    private String title;
    @Column(columnDefinition = "text")//po dulug tekst ot varchar
    private String description;
    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by")//foreign key
    private User createdBy;
    @Column (name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();//koga e suzdaden dokumenta
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
    @OneToOne//dokumenta ima edna aktivna versiq
    @JoinColumn(name = "active_version_id")//fk 
    private Version activeVersion;

    public Document(){}

    public Document(String title, String description, User createdBy){
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
    }

    @PreUpdate//JPA hook
    void onUpdate(){
        this.updatedAt = Instant.now();//obnovqva updatedAt
    }

    public Long getId(){
        return id;
    }
    public String getTitle(){
        return title;
    }
    public String getDescription(){
        return description;
    }
    public User getCreatedBy(){
        return createdBy;
    }
    public Instant getCreatedAt(){
        return createdAt;
    }
    public Instant getUpdatedAt(){
        return updatedAt;
    }
    public Version getActiveVersion(){
        return activeVersion;
    }

    public void setActiveVersion(Version activeVersion){
        this.activeVersion = activeVersion;
    }
}
