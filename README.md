Covid-19 Dashboard group task.

# HOW to install webpack

1. Clone this repo
2. Run `npm install` in the terminal to downloads the packages and it's dependencies

# What does this build include?

- _SASS compiler_
- _webpack-dev-server_ (run `npm run start` in your terminal)
- _eslint-config-airbnb_ (run `npn run lint:fix` in your terminal)
- _normalize.css_ (write `import 'normalize.css';` in your script file)

## [Project structure](https://prnt.sc/w2f01r)

### How to include SASS files into your project?

In your `script.js` file write `import '../styles/[name].sass'`

### How to include any packages and modules into your project?

- **Packages** installed using the terminal.
  Please use [npm documentation](https://www.npmjs.com) for installing new packages
  **!** You need to import new packages into your script file!

- **Modules**
  Use `import './[name].js'`

## Useful links

- **[SASS basics]**(https://sass-lang.com/guide)
- **[Read more about SASS project structure]**(https://itnext.io/structuring-your-sass-projects-c8d41fa55ed4)
- **[Install Node.js and NPM on Windows]**(https://www.guru99.com/download-install-node-js.html#1)
- **[Modules in JS]**(https://learn.javascript.ru/modules)

---

# RU

## Как пользоваться webpack

1. После клонирования репозитория на локальную машину, откройте папку проекта в вашей IDE, затем в терминале переключитесь на свою ветку `git checkout branch-name`, затем в терминале запустите команду `git pull origin develop` для подгрузки изменений в ветке develop
2. Запустите в терминале команду `npm install` для установки необходимых пакетов. После этого появится папка `node_modules`. Её не трогаем. На гитхаб тоже не пушим (для этого создан файл `.gitignore`)
3. После установки пакетов запускаем в терминале команду `npm run start`. Она запускает локальный сервер. **Сборка автоматически обновляется после каждого сохранения!**
4. Юзаем **eslint**! Периодически прерываем работу сервера нажатием `Ctrl+C` и проверяем на наличие ошибок командой `npn run lint:fix` (линтер автоматически исправляет то, что может исправить, остальное выводит в терминал)

## Убедительная просьба!

- Пожалуйста, старайтесь не менять структуру проекта. Можно добавлять модули JS, устанавливать пакеты.
  > Если устанавливаете пакеты, пожалуйста, помечайте где-нибудь, что установили.
- Не изменять файлы (особенно `webpack.config.js`, `package.json`). Можно добавлять исключения в `.eslintrc`, НО желательно исправлять ошибки самостоятельно!
- Пользоваться экспортами/импортами (**разбивать JS на модули**)!!! Файл `script.js` должен быть небольшим и содержать импорты других модулей (аналогично `main.scss` в структуре SASS)
- Использовать **eslint**
- Если проблемы с webpack и eslint, пожалуйста, тегайте меня `@Anhelina Vrubleuskaya#5199`,чтобы пришло уведомление и я скорее помогла :)

Ссылки на некоторые полезные материалы выше
