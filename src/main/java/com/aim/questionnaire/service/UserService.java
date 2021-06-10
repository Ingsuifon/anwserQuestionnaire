package com.aim.questionnaire.service;

import com.aim.questionnaire.dao.UserEntityMapper;
import com.aim.questionnaire.dao.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author: Ingsuifon
 **/
@Service
public class UserService {
    @Autowired
    private UserEntityMapper userEntityMapper;

    public UserEntity selectAllByName(String username) {
        return userEntityMapper.selectAllByName(username);
    }

    public void addUserInfo(UserEntity userEntity) {
        userEntityMapper.addUserInfo(userEntity);
    }

    public List<Map<String, Object>> queryUserList() {
        return userEntityMapper.queryUserList();
    }

    public List<Date> queryDateByName() {
        return userEntityMapper.queryDateByName();
    }
}
