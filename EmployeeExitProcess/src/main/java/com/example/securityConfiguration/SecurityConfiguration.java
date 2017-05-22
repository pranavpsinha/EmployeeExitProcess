package com.example.securityConfiguration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	@Autowired
	UserDetailsServiceImpl userDetails;
	
	// 3
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic().and()
            .authorizeRequests()
            	//add '/' before each request mapping url to override custom methods of security
        		//For All
				//login 
        		.antMatchers("public/login").permitAll() 
				//refreshing logged-in-user data
        		.antMatchers("refreshEmployee").permitAll() 
				//refreshing logged-in-user dash-board-notifications
        		.antMatchers("refreshNotifications").permitAll() 
				//deactivating logged-in-user upon download of relieving letter
        		.antMatchers("deactivate").permitAll() 
				//for profile-update of logged-in-user
        		.antMatchers("updateEmployee").permitAll() 
				
            	//HR
				//to view all the employees
            	.antMatchers("getAllEmployees").hasAuthority("HR") 
				//list of all resign applicants
            	.antMatchers("getPendingResignRequests").hasAuthority("HR") 
				//list of all verified-resign-requests
            	.antMatchers("verifiedEmployee").hasAuthority("HR") 
				//any modifications to applications from HR
            	.antMatchers("addOrUpdateEmployeeHR").hasAuthority("HR") 
				
            	//Accounts
				//to view all the resign applicants 
            	.antMatchers("approved").hasAuthority("Accounts") 
				//any modifications to applications from ACC
            	.antMatchers("addOrUpdateEmployeeACC").hasAuthority("Accounts") 
				
            	//Infrastructure
				//to view all the resign applicants
            	.antMatchers("pendingAtInfra").hasAuthority("Infrastructure") 
				//any modifications to applications from INFRA
            	.antMatchers("addOrUpdateEmployeeINFRA").hasAuthority("Infrastructure") 
				
            	//Regular
				//any modifications to applications from Regular-Employee
            	.antMatchers("addOrUpdateEmployeeR").permitAll() 
            	// end-of-restrictions
				
                .and()
				
            .formLogin()
				//state of login page ! request mapping url
                .loginPage("/login").permitAll() 
				
                .and()
				
            .logout()
				//request-mapping-URL of logout function.
               	.logoutUrl("/logout").permitAll() 
				
                .and()
				
        	.csrf().disable();
    }

    // 2
    @Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetails);

		return authenticationProvider;
	}
    
    @Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

    // 4 - till here, process goes before actual start of project
	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() throws Exception {
		BasicAuthenticationEntryPoint entryPoint = new BasicAuthenticationEntryPoint();
		entryPoint.setRealmName("Spring");
		return entryPoint;
	}
	
    // 1
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    	auth.userDetailsService(userDetails);
		auth.authenticationProvider(authenticationProvider());
    }

}