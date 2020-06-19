package com.uniovi.tests.pageobjects;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.uniovi.utils.SeleniumUtils;

public class PO_PrivateView extends PO_NavView {
	static public void fillFormAddMark(WebDriver driver, int userOrder, String descriptionp, String scorep) {
		// Esperamos 5 segundo a que carge el DOM porque en algunos equipos falla
		try {
			driver.wait(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		// Seleccionamos el alumnos userOrder
		new Select(driver.findElement(By.id("user"))).selectByIndex(userOrder);
		// Rellenemos el campo de descripción
		WebElement description = driver.findElement(By.name("description"));
		description.clear();
		description.sendKeys(descriptionp);
		WebElement score = driver.findElement(By.name("score"));
		score.click();
		score.clear();
		score.sendKeys(scorep);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	static public void loginCheck(WebDriver driver,String dni, String contraseña) {
		PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, dni, contraseña);
		PO_View.checkElement(driver, "text", dni);
	}
	
	/*public static boolean searchInPages(WebDriver driver, String str) {
		List<WebElement> elementos;
		// Esperamos a que se muestren los enlaces de paginación la lista de notas
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@class, 'page-link')]");
		
		while(PO_View.checkElement(driver, "free", "//a[contains(@class, 'page-link')]").size()>0)
		{
			// Nos vamos a la siguiente página
			elementos.get(2).click();
			// Comprobamos que aparece la nota en la pagina
			elementos = PO_View.checkElement(driver, "text", "str");
			if(elementos.size() > 0)
				return true;
		}
		return false;
	}*/
	static public void clickElement(WebDriver driver, String query, int x) {
		List<WebElement>  elementos = PO_View.checkElement(driver, "free", query); 
		elementos.get(x).click();
	}
	
	
}
