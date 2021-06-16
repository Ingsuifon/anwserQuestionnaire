package com.aim.questionnaire.service;

import com.aim.questionnaire.dao.AutoAnswerEntityMapper;
import com.aim.questionnaire.dao.entity.AutoAnswerEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: Ingsuifon
 **/
@Service
public class AutoAnswerService {
    @Autowired
    private AutoAnswerEntityMapper mapper;

    public List<AutoAnswerEntity> selectAll() {
        return mapper.selectAll();
    }

}
