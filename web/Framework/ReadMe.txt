Framework
==========


What can be used as building blocks?

What do we know about the structure of this case?

Do we need typical components like: menus, authentication, etc.?
Or are we using SVGs and render menu as SVG where user can point and click on items?

In any case end result is always similar from the MVC point of view:
- Controllers create models and views.
- Controllers, models and views must be dynamically handled within application.
  Whole life-cycle must be clear: creation, displaying, hiding, removing.
- Observer pattern is used to trigger changes. Models send notifications and Controllers + Views listen for notifications.
  Listeners of course choose which notifications they act upon.



- Models represent data which (usually) is fetched from some URL. It can be very simple where one fetch operation fills 
  model and that's it. Or it can be complex, where many subsequent requests are needed with slightly different URL parameters. 
  Therefore models might have to keep fetch-state stored in private attribute and the knowledge when model is ready.
  
  Notifications: model:'fetched' and model:'fetched-all' are two different cases.
  or the same thing could be put as:
  Notifications: model:'fetched' and model:'fetched-partially' are two different cases.
  
  Sometimes we don't know how many parts we get, the end comes for example in 'No data' RESPONSE.
  
  


index.html:
	<body>
		<section class="container">
			<div id="menu"></div>
		</section>
		<section class="container">
			<div id="content"></div>
		</section>
	</body>


STYLE:
Responsive menu can be easily constructed using CSS:

Menu contains TWO ROWS of components:
- Hamburger + "logo" + Login/Logout
- menuitems



We can have 3 different cases when menu is rendered:
1. User is defined AND user is logged in:

<div class="nav">
	<h1 class="logo">D3.js</h1>
	<div><a id="logout" class="auth-button" href="javascript:void(0);"><i class="small material-icons">power_settings_new</i></a></div>
	<div><a id="hamburger" class="hamburger" href="javascript:void(0);"><i class="small material-icons">menu</i></a></div>
	<ul class="menu-navigation">
		<li class="menu-wrapper"><a class="menu-item active" id="key1">value1</a></li>
		<li class="menu-wrapper"><a class="menu-item" id="key2">value2</a></li>
		<li class="menu-wrapper"><a class="menu-item" id="key3">value3</a></li>
	</ul>
</div>


User is defined AND user is not logged in:
<div class="nav">
	<h1 class="logo">D3.js</h1>
	<div><a id="login" class="auth-button" href="javascript:void(0);"><i class="small material-icons">person</i></a></div>
</div>

User is not defined => no authentication:
<div class="nav">
	<h1 class="logo">D3.js</h1>
	<div><a id="hamburger" class="hamburger" href="javascript:void(0);"><i class="small material-icons">menu</i></a></div>
	<ul class="menu-navigation">
		<li class="menu-wrapper"><a class="menu-item active" id="key1">value1</a></li>
		<li class="menu-wrapper"><a class="menu-item" id="key2">value2</a></li>
		<li class="menu-wrapper"><a class="menu-item" id="key3">value3</a></li>
	</ul>
</div>

