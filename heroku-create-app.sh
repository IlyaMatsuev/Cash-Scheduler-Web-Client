app_name=$1

heroku login
heroku create "$app_name" --buildpack mars/create-react-app --region eu
git push heroku master
heroku open
