# Contributing to SignUp Worker

We welcome contributions to the SignUp Worker project! This document provides guidelines for contributing to this repository.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check existing issues to avoid duplicates
2. Use the issue template if available
3. Provide detailed information about the problem
4. Include steps to reproduce the issue
5. Specify your environment (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
1. Check if the feature has already been requested
2. Clearly describe the enhancement and its benefits
3. Provide examples of how it would be used
4. Consider backward compatibility implications

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the setup instructions** in the README
3. **Make your changes** following our coding standards
4. **Add tests** if applicable
5. **Update documentation** as needed
6. **Test your changes** thoroughly
7. **Submit a pull request** with a clear description

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy configuration: `cp wrangler.toml.example wrangler.toml`
4. Set up environment variables and KV namespaces
5. Start development server: `npm run dev`

## Coding Standards

### JavaScript Style
- Use ES6+ features and modules
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Prefer `const` over `let`, avoid `var`

### Security Guidelines
- Never hardcode secrets or sensitive data
- Validate and sanitize all user inputs
- Follow OWASP security best practices
- Use appropriate error handling
- Implement proper rate limiting

### Code Organization
- Keep functions small and focused
- Separate concerns appropriately
- Use consistent file structure
- Follow established patterns in the codebase

## Testing

- Test your changes locally using the development server
- Use the provided `test.html` for manual testing
- Ensure all security features work as expected
- Test rate limiting and CAPTCHA functionality
- Verify CORS and security headers

## Documentation

When making changes:
- Update the README if functionality changes
- Add or update code comments
- Update the CHANGELOG for notable changes
- Include examples in documentation

## Pull Request Process

1. **Create a descriptive PR title** (e.g., "Add email domain validation feature")
2. **Fill out the PR template** with:
   - Description of changes
   - Testing performed
   - Breaking changes (if any)
   - Related issues
3. **Ensure CI passes** (if applicable)
4. **Request review** from maintainers
5. **Address feedback** promptly

## Security Considerations

This is a security-focused project. When contributing:

- **Never introduce vulnerabilities**
- **Follow secure coding practices**
- **Test security features thoroughly**
- **Report security issues privately** first
- **Consider attack vectors** for new features

### Security Issue Reporting

For security-related issues:
1. **Do not** create a public issue
2. Email security concerns to [security contact]
3. Provide detailed information
4. Allow time for proper assessment and fix

## Types of Contributions

We welcome various types of contributions:

### Bug Fixes
- Fix existing functionality issues
- Improve error handling
- Address security vulnerabilities

### Features
- Rate limiting improvements
- Additional validation rules
- New security headers
- Enhanced monitoring

### Documentation
- README improvements
- Code comments
- Setup guides
- Best practices

### Testing
- Test coverage improvements
- Integration tests
- Security testing
- Performance testing

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Create release notes
4. Tag the release
5. Deploy to production

## Questions and Support

- Check the README and documentation first
- Search existing issues and discussions
- Create an issue for bugs or feature requests
- Use discussions for general questions

## Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- Project documentation

Thank you for contributing to SignUp Worker! Your efforts help make this project more secure and useful for everyone.
