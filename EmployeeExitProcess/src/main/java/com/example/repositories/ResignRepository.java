package com.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.entities.ResignEntity;

@Repository
public interface ResignRepository extends JpaRepository<ResignEntity, Long>{

	List<ResignEntity> findByFlagAndConfirmationAndResignApplied(boolean f, boolean c, boolean ra);

	ResignEntity findByResignationId(Long resignId);


}
