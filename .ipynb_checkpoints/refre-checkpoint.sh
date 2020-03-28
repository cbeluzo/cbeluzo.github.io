cd code
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_sns_population_infection_rate.ipynb
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_time_serires_daily_growth_rate.ipynb
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_time_series_comfirmed_cases.ipynb 
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_total_deaths.ipynb
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_time_series_population_infection_rate.ipynb
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_total_deaths.nbconvert.ipynb
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_time_series_total_deaths.ipynb
jupyter nbconvert --to notebook --ExecutePreprocessor.timeout=-1 --execute covid_19_total_deaths_animation.ipynb

rm *.nbconvert.ipynb

cd ..

git add .
git commit -m "Refresh"
git pull
git push