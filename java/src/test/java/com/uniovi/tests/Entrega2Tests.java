package com.uniovi.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.junit.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.uniovi.tests.pageobjects.*;
import com.uniovi.utils.SeleniumUtils;

import org.junit.runners.MethodSorters;

//Ordenamos las pruebas por el nombre del método 
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Entrega2Tests {
	
	
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "C:\\Users\\Propietario\\Desktop\\Clase\\SDI\\P5Material\\PL-SDI-Sesión5-material\\geckodriver024win64.exe";
	
	
	
	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	static String URL = "https://localhost:8081";

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	/// Antes de cada prueba se navega al URL home de la aplicaciónn
	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	// Después de cada prueba se borran las cookies del navegador
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	// Antes de la primera prueba
	@BeforeClass
	static public void begin() {

	}

	// Al finalizar la última prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}
	
	//[Prueba1]Registro de Usuario con datos válidos.
	@Test
	public void PR01() {
		driver.navigate().to(URL+"/registrarse");
		PO_RegisterViewNode.fillForm(driver, "P1", "P1", "p1@p1.com", "123", "123");
		PO_View.checkElement(driver, "text", "Nuevo usuario registrado");
	}
	//[Prueba2]Registro de Usuario con datos inválidos (email vacío, nombre vacío, apellidos vacíos).
		@Test
		public void PR02() {
			driver.navigate().to(URL+"/registrarse");
			PO_RegisterViewNode.fillForm(driver, "P1", "P1", "", "123", "123");
			PO_View.checkElement(driver, "text", "Rellene todos los campos");
			PO_RegisterViewNode.fillForm(driver, "", "P1", "p1@p1.com", "123", "123");
			PO_View.checkElement(driver, "text", "Rellene todos los campos");
			PO_RegisterViewNode.fillForm(driver, "P1", "", "p1@p1.com", "123", "123");
			PO_View.checkElement(driver, "text", "Rellene todos los campos");
		}
	//[Prueba3]Registro de Usuario con datos inválidos (repetición de contraseña inválida)
		@Test
		public void PR03() {
			driver.navigate().to(URL+"/registrarse");
			PO_RegisterViewNode.fillForm(driver, "P2", "P2", "p2@p2.com", "13", "123");
			PO_View.checkElement(driver, "text", "Las contraseñas no coinciden");
		}
	//[Prueba3]Registro de Usuario con datos inválidos (repetición de contraseña inválida)
			@Test
			public void PR04() {
				driver.navigate().to(URL+"/registrarse");
				PO_RegisterViewNode.fillForm(driver, "P1", "P1", "p1@p1.com", "123", "123");
				PO_View.checkElement(driver, "text", "Ya existe un usuario con ese email");
			}
	//[Prueba5]Inicio de sesión con datos válidos (usuario estándar).
			@Test
			public void PR05() {
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				PO_View.checkElement(driver, "text", "Usuarios");
			}
			//[Prueba6]Inicio de sesión con datos inválidos (usuario estándar, campo email y contraseña vacíos)
			@Test
			public void PR06() {
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "");
				PO_View.checkElement(driver, "text", "Rellene todos los campos");
				PO_LoginViewNode.fillForm(driver, "", "111");
				PO_View.checkElement(driver, "text", "Rellene todos los campos");
				PO_LoginViewNode.fillForm(driver, "", "");
				PO_View.checkElement(driver, "text", "Rellene todos los campos");
			}
			//[Prueba7]Iniciodesesión  con  datos inválidos(usuario  estándar,  email  existente,  pero  contraseña incorrecta)
			@Test
			public void PR07() {
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "12387");
				PO_View.checkElement(driver, "text", "Contraseña incorrecta");
			}
			//[Prueba8]Inicio de sesión con datos inválidos (usuario estándar, email no existentey contraseña no vacía).
			@Test
			public void PR08() {
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p132.com", "12387");
				PO_View.checkElement(driver, "text", "Usuario inexistente");
			}
			//[Prueba9]Hacer click en la opción de salir de sesión y comprobar que se redirige a la página de inicio de sesión (Login).
			@Test
			public void PR09() {
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				PO_HomeView.clickOption(driver, "desconectarse", "id", "Usuarios");
				PO_View.checkElement(driver, "text", "Identificación de usuario");
			}
			//[Prueba10]Comprobar que el botón cerrar sesión no está visible si el usuario no está autenticado.
			@Test
			public void PR10() {
				//Comprobamos que no sale al no estar registrados.
				SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Cerrar Sesión", PO_View.getTimeout());
			}
			//[Prueba11]Mostrar el listado de usuarios y comprobar que se muestran todos los que existen enel sistema
			@Test
			public void PR11() {
				//Acceso
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Compruebo tamaño lista
				List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
						PO_View.getTimeout());
				assertTrue(elementos.size() == 5);
				//compruebo que estan los usuarios
				PO_View.checkElement(driver, "text", "Luis");
				PO_View.checkElement(driver, "text", "Fernando");
				PO_View.checkElement(driver, "text", "Jony");
				PO_View.checkElement(driver, "text", "Felipe");
				PO_View.checkElement(driver, "text", "Rolando");
				
			}
			//Prueba12]Hacer  una  búsqueda  con  el  campo  vacío  y  comprobar  que  se  muestra  la  página  que corresponde con el listado usuarios existentes en el sistema.
			@Test
			public void PR12() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Relleno buscador
				PO_SearchUserNode.fillForm(driver,"");
				//Compruebo tamaño lista
				List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
						PO_View.getTimeout());
				assertTrue(elementos.size() == 5);
				//compruebo que estan los usuarios
				PO_View.checkElement(driver, "text", "Luis");
				PO_View.checkElement(driver, "text", "Fernando");
				PO_View.checkElement(driver, "text", "Jony");
				PO_View.checkElement(driver, "text", "Felipe");
				PO_View.checkElement(driver, "text", "Rolando");
				
			}
//[Prueba13]Hacer  una  búsqueda  escribiendo  en  el  campo  un  texto  que  no  exista  y  comprobar  que  se muestra la página que corresponde, con la lista de usuarios vacía.
			@Test
			public void PR13() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Relleno buscador
				PO_SearchUserNode.fillForm(driver,"xw");
				//compruebo que no hay nada con ese texto
				SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "xw", PO_View.getTimeout());
				
			}
//[Prueba14]Hacer  una  búsqueda con  un texto  específico y  comprobar  que  se  muestra  la  página  que corresponde, con la lista de usuarios en los que el textoespecificados sea parte de su nombre, apellidos o de su email
			@Test
			public void PR14() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Relleno buscador
				PO_SearchUserNode.fillForm(driver,"P1");
				//Compruebo tamaño lista
				List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
						PO_View.getTimeout());
				assertTrue(elementos.size() == 1);
				//compruebo que el unico usuario que deberia estar
				PO_View.checkElement(driver, "text", "P1");
				
			}	
//[Prueba15]Desde el listado de usuarios de la aplicación, enviar una invitación de amistad a un usuario. Comprobar que la solicitud de amistad aparece en el listado de invitaciones (punto siguiente). 
			@Test
			public void PR15() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Envio solicitud a Luis
				List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@id, 'prueba1@prueba1')]");
				elementos.get(0).click();
				//compruebo que sale elmensaje de confirmacion
				PO_View.checkElement(driver, "text", "Solicitud enviada");
				//Salgo de sesion
				PO_HomeView.clickOption(driver, "desconectarse", "id", "Usuarios");
				//Accedo a la cuenta que recive la invitacion
				PO_LoginViewNode.fillForm(driver, "prueba1@prueba1.com", "prueba1");
				//Voy a las invitaciones
				PO_HomeView.clickOption(driver, "invitaciones", "id", "Invitaciones");
				//Compruebo que sale la invitacion
				PO_View.checkElement(driver, "text", "P1");
			}
//Prueba16]Desde el listado de usuarios de la aplicación, enviar una invitación de amistad a un usuario al que ya le habíamos enviado la invitación previamente. No debería dejarnos enviar la invitación, se podría ocultar el botón de enviar invitación onotificar que ya había sido enviada previamente.
			@Test
			public void PR16() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Envio solicitud a Luis
				List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@id, 'prueba1@prueba1')]");
				elementos.get(0).click();
				//compruebo sale el mensaje que m informa que no puedo
				PO_View.checkElement(driver, "text", "El usuario ya es tu amigo,o alguno de los dos ya lo ha solicitado");
				
			}
//[Prueba17]Mostrar  el  listado  de  invitaciones  de  amistad  recibidas.  Comprobar con  un  listado  que contenga varias invitacionesrecibidas
			@Test
			public void PR17() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "prueba1@prueba1.com", "prueba1");
				//Voy a las invitaciones
				PO_HomeView.clickOption(driver, "invitaciones", "id", "Invitaciones");
				//Compruebo tamaño lista, tendria que haber 3 invitaciones
				List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
						PO_View.getTimeout());
				assertTrue(elementos.size() == 3);
				//Compruebo que salen las invitaciones correctas
				PO_View.checkElement(driver, "text", "Fernando");
				PO_View.checkElement(driver, "text", "Jony");
				PO_View.checkElement(driver, "text", "P1");
			}
//[Prueba18]Sobre  el  listado  de  invitaciones  recibidas.  Hacer  click  en  el  botón/enlace  de  una  de  ellas  y comprobar que dicha solicitud desaparece del listado de invitaciones.
			@Test
			public void PR18() {
				//Acceso 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "prueba1@prueba1.com", "prueba1");
				//Voy a las invitaciones
				PO_HomeView.clickOption(driver, "invitaciones", "id", "Invitaciones");
				//Acepto la de el usuario P1
				List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@id, 'aceptar_p1@p1')]");
				elementos.get(0).click();
				//Compruebo que ya no esta
				SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "P1", PO_View.getTimeout());	
			}
//[Prueba19]Mostrar el listado de amigos de un usuario. Comprobar que el listado contiene los amigos que deben ser
			@Test
			public void PR19() {
				//Accedemos a P1 
				driver.navigate().to(URL+"/identificarse");
				PO_LoginViewNode.fillForm(driver, "p1@p1.com", "123");
				//Voy a los amigos
				PO_HomeView.clickOption(driver, "amigos", "id", "Amigos");
				//Solo deberia haber un amigo y deberia ser Luis
				List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
						PO_View.getTimeout());
				assertTrue(elementos.size() == 1);
				PO_View.checkElement(driver, "text", "Luis");
			}
//[Prueba20]Intentar acceder sin estar autenticado a la opción de listado de usuarios. Se deberá volver al formulario de login.
			@Test
			public void PR20() {
				//Accedemos a /usuarios
				driver.navigate().to(URL+"/usuarios");
				//Miramos si estamos en identificate
				PO_View.checkElement(driver, "text", "Identificación de usuario");	
			}
//[Prueba21]Intentar acceder sin estar autenticado a la opción de listado de invitaciones de amistad recibida de un usuario estándar. Se deberá volver al formulario de login.
			@Test
			public void PR21() {
				//Accedemos a /invitaciones
				driver.navigate().to(URL+"/invitaciones");
				//Miramos si estamos en identificate
				PO_View.checkElement(driver, "text", "Identificación de usuario");	
			}
//[Prueba22]Intentar  acceder estando  autenticado  como  usuario  standard  a la  lista  de  amigos  de  otro usuario. Se deberá mostrar un mensaje de acción indebida.
			@Test
			public void PR22() {
				//Esta prueba para tal y como tenemos implementado el proyecto no tiene sentido.
				//Para poder hacerla se deberia pasar el id al ir a amigos, pero nosotros no lo hacemos, utilizamos el usuario en session para buscar sus amigos.
			}
			
			//[Prueba23]Inicio de sesión con datos válidos.
			@Test
			public void PR23() {
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "button", "Actualizar");
			}
			//[Prueba24]Inicio de sesión con datos inválidos (usuario no existente en la aplicación)
			@Test
			public void PR24() {
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "anon@mouse.com", "password");
				PO_View.checkElement(driver, "text", "Usuario o contraseña incorrectos");
			}
			
//			[Prueba25]Acceder a la lista de amigos de un usuario, que al menos tenga tres amigos.
			@Test
			public void PR25() {
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "button", "Actualizar");
				
				assert(PO_View.checkElement(driver, "class", "filaAmigo").size() >=3);
			}
//			[Prueba26]Acceder a la lista de amigos de un usuario, y realizar un filtrado para
//			encontrar a un amigo concreto, el nombre a buscar debe coincidir con el de un amigo
			@Test
			public void PR26() {
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "button", "Actualizar");
				
				PO_Cliente.filterFriend(driver, "prueba4");
				PO_View.checkElement(driver, "text", "Alonso");
			}
//			[Prueba27] Acceder a la lista de mensajes de un amigo “chat”, la lista debe contener al menos tres mensajes.
			@Test
			public void PR27() {
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "text", "Jony");
				
				PO_Cliente.openFriendChat(driver, "Jony");
				
				assert(PO_View.checkElement(driver, "class", "msg").size() >=3);
			}
			
//			[Prueba28] Acceder a la lista de mensajes de un amigo “chat” y crear un nuevo mensaje, validar que el mensaje aparece en la lista de mensajes.
			@Test
			public void PR28() {
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "text", "Jony");
				
				PO_Cliente.openFriendChat(driver, "Felipe");
				
				Random rand = new Random();
				String str = Integer.toString(rand.nextInt(1000000000));
				
				PO_Cliente.sendMessage(driver, "Aleatorio: "+str);
				
				PO_View.checkElement(driver, "text", str);
			}
			
			//[Prueba29]Identificarse en la aplicación y enviar un mensaje a un amigo, validar que el mensaje enviado aparece  en  el  chat.  Identificarse  después  con  el  usuario  que  recibido  el  mensaje  y  validar  que  tiene  un mensaje sin leer, entrar en el chat y comprobar que el mensaje pasa a tener el estado leído.
			@Test
			public void PR29(){
				//vamos a limpiar los mensajes no leidos de Felipe para hacer la prueba
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba5@prueba5.com", "prueba5");
				PO_View.checkElement(driver, "text", "Fernando");
				PO_Cliente.openFriendChat(driver, "Fernando");
				
				//Comprobaciones solo para hacer tiempo
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				
				//Fernando envia mensaje a Felipe
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "text", "Jony");
				
				PO_Cliente.openFriendChat(driver, "Felipe");
				
				Random rand = new Random();
				String str = Integer.toString(rand.nextInt(1000000000));
				
				PO_Cliente.sendMessage(driver, "Aleatorio: "+str);
				
				PO_View.checkElement(driver, "text", str);
				
				
				//Felipe comprueba que hay un mensaje no leido y entra a leerlo
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba5@prueba5.com", "prueba5");
				
				PO_View.checkElement(driver, "text", "1");
				PO_Cliente.openFriendChat(driver, "Fernando");
				
				//Comprobaciones solo para hacer tiempo
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				
				//Fernando comprueva que esta leido
				
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "text", "Jony");
				
				PO_Cliente.openFriendChat(driver, "Felipe");
				
				PO_View.checkElement(driver, "text", str+" ✔(leido)");
				
				
			}
			
			//Prueba30]Identificarse en la aplicación y enviar tres mensajes a un amigo, validar que los mensajes enviados aparecen en el chat. Identificarse después con el usuario que recibido el mensaje y validar que el número de mensajes sin leer aparece en la propia lista de amigos.
			@Test
			public void PR30(){
				//vamos a limpiar los mensajes no leidos de Felipe para hacer la prueba
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba5@prueba5.com", "prueba5");
				PO_View.checkElement(driver, "text", "Fernando");
				PO_Cliente.openFriendChat(driver, "Fernando");
				
				//Comprobaciones solo para hacer tiempo
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
				
				//Fernando envia 3 mensajes a Felipe
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba2@prueba2.com", "prueba2");
				PO_View.checkElement(driver, "text", "Jony");
				
				PO_Cliente.openFriendChat(driver, "Felipe");
				
				Random rand = new Random();
				String str1 = Integer.toString(rand.nextInt(1000000000));
				
				PO_Cliente.sendMessage(driver, "Aleatorio: "+str1);
				
				PO_View.checkElement(driver, "text", str1);
				
				String str2 = Integer.toString(rand.nextInt(1000000000));
				
				PO_Cliente.sendMessage(driver, "Aleatorio: "+str2);
				
				PO_View.checkElement(driver, "text", str2);
				
				String str3 = Integer.toString(rand.nextInt(1000000000));
				
				PO_Cliente.sendMessage(driver, "Aleatorio: "+str3);
				
				PO_View.checkElement(driver, "text", str3);
				
				
				//Felipe comprueba que hay 3 mensajes no leidos
				driver.navigate().to(URL+"/cliente.html");
				PO_Cliente.login(driver, "prueba5@prueba5.com", "prueba5");
				
				PO_View.checkElement(driver, "text", "3");
				PO_Cliente.openFriendChat(driver, "Fernando");
				
				
			}
			//Prueba Pra reestablecer los datos de las pruebas
			@Test
			public void PR999ReestablecerPruebas() {
				PO_HomeView.clickOption(driver, "reiniciar", "id", "reiniciar");

			}
			
}

