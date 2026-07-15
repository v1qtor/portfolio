module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
	eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
	eleventyConfig.addPassthroughCopy({
		"src/assets/images/favicon_io/site.webmanifest": "site.webmanifest"
	});

	return {
		dir: {
			input: "src",
			includes: "_includes",
			output: "_site"
		},
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk"
	};
};
