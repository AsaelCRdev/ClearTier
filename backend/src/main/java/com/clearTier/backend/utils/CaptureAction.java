package com.clearTier.backend.utils;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CaptureAction{
    String action();
    String targetType();
    String targetIdSpEL();
} 