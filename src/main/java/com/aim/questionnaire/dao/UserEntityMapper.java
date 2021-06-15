package com.aim.questionnaire.dao;

import com.aim.questionnaire.dao.entity.UserEntity;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Map;


@Repository
public interface UserEntityMapper {
    /**
     * 根据用户名查找用户信息
     * @param username
     * @return
     */
    UserEntity selectAllByName(String username);
    void addUserInfo(UserEntity userEntity);
    List<Map<String, Object>> queryUserList(UserEntity userEntity);
    Map<String, Object> queryUserListById(String id);
    List<Date> queryDateByName();
}