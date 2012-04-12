


final: languages.json stackedhistory.json

%.json : %.sh
	echo "Generate $@ from $<"
	./$< > $@

.PHONY: clean
clean:
	rm *.json
